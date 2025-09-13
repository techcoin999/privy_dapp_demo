#!/bin/bash

# 简单版本的emoji去除脚本
# Simple version of emoji removal script

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_message() {
    local color=$1
    local message=$2
    echo -e "${color}${message}${NC}"
}

# 检查是否在项目根目录
if [[ ! -f "package.json" ]]; then
    print_message $RED "错误: 请在项目根目录运行此脚本"
    exit 1
fi

print_message $BLUE "开始处理项目文件中的emoji符号..."

# 定义常见的emoji符号
EMOJIS=(
    "✅" "🚀" "💰" "🔗" "📱" "⚡" "🎯" "🛡️" "🌟" "💎" 
    "🔥" "📊" "🎨" "🚨" "⭐" "❌" "✨" "🎉" "💡" "🔧" 
    "📝" "🎪" "🎭" "🎲" "🎳" "🎮" "🎰" "🎱" "🎴" "🎵" 
    "🎶" "🎷" "🎸" "🎹" "🎺" "🎻" "🎼" "🎽" "🎾" "🎿" 
    "🏀" "🏁" "🏂" "🏃" "🏄" "🏅" "🏆" "🏇" "🏈" "🏉" 
    "🏊" "🏋" "🏌" "🏍" "🏎" "🏏" "🏐" "🏑" "🏒" "🏓"
    "📚" "📖" "📗" "📘" "📙" "📕" "📒" "📓" "📔" "📄"
    "📃" "📑" "📊" "📈" "📉" "📇" "📋" "📌" "📍" "📎"
    "🔒" "🔓" "🔏" "🔐" "🔑" "🗝" "🔨" "⛏" "⚒" "🛠"
    "⚙" "🔩" "⚖" "🔗" "⛓" "🧰" "🧲" "⚗" "🧪" "🧫"
)

# 查找包含emoji的文件
print_message $YELLOW "正在搜索包含emoji的文件..."

FILES_WITH_EMOJIS=()

# 构建grep模式
GREP_PATTERN=""
for i in "${!EMOJIS[@]}"; do
    if [[ $i -eq 0 ]]; then
        GREP_PATTERN="${EMOJIS[$i]}"
    else
        GREP_PATTERN="$GREP_PATTERN\|${EMOJIS[$i]}"
    fi
done

# 查找文件 - 更安全的过滤
while IFS= read -r -d '' file; do
    # 跳过二进制文件和特殊文件
    if file "$file" | grep -q "binary\|executable\|image\|audio\|video"; then
        continue
    fi

    # 检查文件是否包含emoji
    if grep -q "$GREP_PATTERN" "$file" 2>/dev/null; then
        # 额外安全检查：跳过可能是库文件或编译产物的文件
        case "$file" in
            *node_modules*|*dist*|*build*|*.min.js|*.bundle.js|*vendor*|*lib*|*.map)
                print_message $YELLOW "跳过库文件或编译产物: $file"
                continue
                ;;
            *)
                FILES_WITH_EMOJIS+=("$file")
                ;;
        esac
    fi
done < <(find . -type f \( -name "*.md" -o -name "*.txt" -o -name "*.js" -o -name "*.jsx" -o -name "*.ts" -o -name "*.tsx" -o -name "*.json" -o -name "*.html" -o -name "*.css" \) \
    -not -path "./node_modules/*" \
    -not -path "./dist/*" \
    -not -path "./.git/*" \
    -not -path "./.next/*" \
    -not -path "./build/*" \
    -not -path "./coverage/*" \
    -not -path "./.vscode/*" \
    -not -path "./.idea/*" \
    -not -path "./tmp/*" \
    -not -path "./temp/*" \
    -print0)

if [[ ${#FILES_WITH_EMOJIS[@]} -eq 0 ]]; then
    print_message $GREEN "✓ 没有找到包含emoji的文件"
    exit 0
fi

print_message $YELLOW "找到 ${#FILES_WITH_EMOJIS[@]} 个包含emoji的文件:"
for file in "${FILES_WITH_EMOJIS[@]}"; do
    echo "  - $file"
    # 显示找到的emoji
    grep -o "$GREP_PATTERN" "$file" 2>/dev/null | sort | uniq | head -5 | while read -r emoji; do
        echo "    包含: $emoji"
    done
done

# 询问用户确认
echo ""
read -p "是否继续处理这些文件? (y/N): " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    print_message $YELLOW "操作已取消"
    exit 0
fi

# 处理文件
PROCESSED_COUNT=0
ERROR_COUNT=0

for file in "${FILES_WITH_EMOJIS[@]}"; do
    print_message $BLUE "正在处理: $file"
    
    # 创建备份
    cp "$file" "$file.backup"
    
    # 构建sed命令来去除所有emoji
    SED_COMMAND=""
    for emoji in "${EMOJIS[@]}"; do
        if [[ -z "$SED_COMMAND" ]]; then
            SED_COMMAND="s/$emoji//g"
        else
            SED_COMMAND="$SED_COMMAND; s/$emoji//g"
        fi
    done
    
    # 执行替换
    if sed "$SED_COMMAND" "$file" > "$file.tmp"; then
        mv "$file.tmp" "$file"
        ((PROCESSED_COUNT++))
        print_message $GREEN "✓ 已处理: $file"
    else
        print_message $RED "✗ 处理失败: $file"
        # 恢复备份
        mv "$file.backup" "$file"
        rm -f "$file.tmp"
        ((ERROR_COUNT++))
    fi
done

echo ""
print_message $GREEN "处理完成!"
print_message $GREEN "成功处理: $PROCESSED_COUNT 个文件"
if [[ $ERROR_COUNT -gt 0 ]]; then
    print_message $RED "处理失败: $ERROR_COUNT 个文件"
fi

print_message $BLUE "备份文件已创建，文件名后缀为 .backup"
print_message $BLUE "如需恢复，可以使用: mv filename.backup filename"
print_message $YELLOW "建议运行测试确保项目仍然正常工作"

# 显示处理结果
if [[ $PROCESSED_COUNT -gt 0 ]]; then
    echo ""
    print_message $BLUE "处理后的文件预览:"
    for file in "${FILES_WITH_EMOJIS[@]}"; do
        if [[ -f "$file" ]]; then
            echo "--- $file ---"
            head -10 "$file"
            echo ""
        fi
    done
fi
