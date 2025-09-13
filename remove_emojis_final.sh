#!/bin/bash

# 最终版emoji去除脚本 - 安全、可靠、彻底
# Final emoji removal script - Safe, reliable, and thorough

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m'

print_message() {
    local color=$1
    local message=$2
    echo -e "${color}${message}${NC}"
}

# 显示帮助信息
show_help() {
    echo "最终版Emoji去除脚本"
    echo ""
    echo "用法: $0 [选项]"
    echo ""
    echo "选项:"
    echo "  -h, --help     显示此帮助信息"
    echo "  -d, --dry-run  预览模式，只显示会被修改的文件，不实际修改"
    echo "  -v, --verbose  详细输出模式"
    echo "  -f, --force    强制模式，跳过确认"
    echo ""
    echo "此脚本会安全地去除项目中源代码文件的emoji符号"
    echo "自动跳过编译产物、库文件和二进制文件"
}

# 默认参数
DRY_RUN=false
VERBOSE=false
FORCE=false

# 解析命令行参数
while [[ $# -gt 0 ]]; do
    case $1 in
        -h|--help)
            show_help
            exit 0
            ;;
        -d|--dry-run)
            DRY_RUN=true
            shift
            ;;
        -v|--verbose)
            VERBOSE=true
            shift
            ;;
        -f|--force)
            FORCE=true
            shift
            ;;
        *)
            print_message $RED "未知选项: $1"
            show_help
            exit 1
            ;;
    esac
done

# 检查是否在项目根目录
if [[ ! -f "package.json" ]]; then
    print_message $RED "错误: 请在项目根目录运行此脚本"
    exit 1
fi

print_message $BLUE "开始最终emoji清理..."

# 安全文件检查函数
is_safe_to_modify() {
    local file="$1"
    
    # 检查文件是否为二进制文件
    if file "$file" 2>/dev/null | grep -q "binary\|executable\|image\|audio\|video\|archive"; then
        return 1
    fi
    
    # 检查文件路径是否安全
    case "$file" in
        # 跳过编译产物和库文件
        *node_modules*|*dist*|*build*|*.min.js|*.bundle.js|*vendor*|*lib*|*.map)
            return 1
            ;;
        # 跳过版本控制和IDE文件
        *.git*|*.vscode*|*.idea*|*.DS_Store)
            return 1
            ;;
        # 跳过临时文件和备份文件
        *tmp*|*temp*|*.tmp|*.temp|*.log|*.cache|*.backup|*.bak|*emoji-backup*)
            return 1
            ;;
        # 跳过锁文件
        *lock*|*.lock|yarn.lock|package-lock.json)
            return 1
            ;;
        # 跳过脚本文件本身
        *remove_emojis*.sh)
            return 1
            ;;
        # 允许的文件类型
        *.md|*.txt|*.js|*.jsx|*.ts|*.tsx|*.json|*.html|*.css|*.vue|*.py|*.java|*.go|*.rs|*.php|*.rb|*.swift|*.kt)
            return 0
            ;;
        *)
            # 其他文件需要额外检查
            if [[ -f "$file" && -r "$file" ]]; then
                # 检查文件大小（跳过过大的文件，可能是数据文件）
                local size=$(stat -f%z "$file" 2>/dev/null || stat -c%s "$file" 2>/dev/null || echo 0)
                if [[ $size -gt 1048576 ]]; then  # 1MB
                    return 1
                fi
                return 0
            fi
            return 1
            ;;
    esac
}

# 使用Python进行更可靠的emoji处理
process_file_with_python() {
    local input_file="$1"
    local output_file="$2"
    
    python3 -c "
import re
import sys

# 读取文件内容
try:
    with open('$input_file', 'r', encoding='utf-8') as f:
        content = f.read()
except Exception as e:
    print(f'Error reading file: {e}', file=sys.stderr)
    sys.exit(1)

# 定义emoji的Unicode范围
emoji_pattern = re.compile(
    '['
    '\U0001F600-\U0001F64F'  # emoticons
    '\U0001F300-\U0001F5FF'  # symbols & pictographs
    '\U0001F680-\U0001F6FF'  # transport & map symbols
    '\U0001F1E0-\U0001F1FF'  # flags (iOS)
    '\U00002600-\U000026FF'  # miscellaneous symbols
    '\U00002700-\U000027BF'  # dingbats
    '\U0001F900-\U0001F9FF'  # supplemental symbols and pictographs
    '\U0001F018-\U0001F270'  # various symbols
    '\U0000238C-\U00002454'  # miscellaneous symbols
    '\U000020D0-\U000020FF'  # combining diacritical marks for symbols
    '\U0000FE0F'             # variation selector
    '\U0000200D'             # zero width joiner
    '\U00002049'             # exclamation question mark
    '\U0000203C'             # double exclamation mark
    '\U00002139'             # information source
    '\U00002194-\U00002199'  # arrows
    '\U000021A9-\U000021AA'  # arrows
    '\U0000231A-\U0000231B'  # watch
    '\U00002328'             # keyboard
    '\U000023CF'             # eject symbol
    '\U000023E9-\U000023F3'  # play/pause buttons
    '\U000023F8-\U000023FA'  # play/pause buttons
    '\U000024C2'             # circled M
    '\U000025AA-\U000025AB'  # squares
    '\U000025B6'             # play button
    '\U000025C0'             # reverse button
    '\U000025FB-\U000025FE'  # squares
    '\U00002B05-\U00002B07'  # arrows
    '\U00002B1B-\U00002B1C'  # squares
    '\U00002B50'             # star
    '\U00002B55'             # circle
    '\U00003030'             # wavy dash
    '\U0000303D'             # part alternation mark
    '\U00003297'             # congratulations
    '\U00003299'             # secret
    ']+', 
    flags=re.UNICODE
)

# 去除emoji
cleaned_content = emoji_pattern.sub('', content)

# 写入输出文件
try:
    with open('$output_file', 'w', encoding='utf-8') as f:
        f.write(cleaned_content)
    print('SUCCESS')
except Exception as e:
    print(f'Error writing file: {e}', file=sys.stderr)
    sys.exit(1)
"
}

# 查找包含emoji的文件
print_message $YELLOW "正在扫描文件..."

FILES_WITH_EMOJIS=()
SCANNED_COUNT=0
SKIPPED_COUNT=0

# 简单的emoji检测模式（用于快速筛选）
SIMPLE_EMOJI_PATTERN="✅\|❌\|⭐\|🚀\|💰\|🔗\|📱\|⚡\|🎯\|🛡️\|🌟\|💎\|🔥\|📊\|🎨\|🚨\|✨\|🎉\|💡\|🔧\|📝"

# 使用find查找文件并进行安全检查
while IFS= read -r -d '' file; do
    ((SCANNED_COUNT++))
    
    if [[ $VERBOSE == true ]]; then
        print_message $BLUE "扫描: $file"
    fi
    
    # 安全检查
    if ! is_safe_to_modify "$file"; then
        ((SKIPPED_COUNT++))
        if [[ $VERBOSE == true ]]; then
            print_message $YELLOW "跳过: $file (不安全或不适合修改)"
        fi
        continue
    fi
    
    # 检查是否包含emoji（使用简单模式快速筛选）
    if grep -q "$SIMPLE_EMOJI_PATTERN" "$file" 2>/dev/null; then
        FILES_WITH_EMOJIS+=("$file")
        if [[ $VERBOSE == true ]]; then
            print_message $GREEN "发现emoji: $file"
        fi
    fi
done < <(find . -type f \
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
    -not -name "*emoji-backup*" \
    -print0)

print_message $BLUE "扫描完成: 扫描了 $SCANNED_COUNT 个文件，跳过了 $SKIPPED_COUNT 个文件"

# 检查结果
if [[ ${#FILES_WITH_EMOJIS[@]} -eq 0 ]]; then
    print_message $GREEN "✓ 没有找到包含emoji的文件"
    exit 0
fi

print_message $YELLOW "找到 ${#FILES_WITH_EMOJIS[@]} 个包含emoji的文件:"
for file in "${FILES_WITH_EMOJIS[@]}"; do
    echo "  - $file"
    if [[ $VERBOSE == true ]]; then
        # 显示找到的emoji（限制显示数量）
        grep -o "$SIMPLE_EMOJI_PATTERN" "$file" 2>/dev/null | sort | uniq | head -5 | while read -r emoji; do
            echo "    包含: $emoji"
        done
    fi
done

# 预览模式
if [[ $DRY_RUN == true ]]; then
    print_message $BLUE "预览模式: 以下文件将被修改 (实际未修改)"
    for file in "${FILES_WITH_EMOJIS[@]}"; do
        print_message $YELLOW "将处理: $file"
        echo "  当前emoji:"
        grep -o "$SIMPLE_EMOJI_PATTERN" "$file" 2>/dev/null | sort | uniq | while read -r emoji; do
            echo "    - $emoji"
        done
    done
    exit 0
fi

# 检查Python是否可用
if ! command -v python3 &> /dev/null; then
    print_message $RED "错误: 需要Python 3来进行可靠的emoji处理"
    print_message $YELLOW "请安装Python 3或使用简单版本的脚本"
    exit 1
fi

# 用户确认
if [[ $FORCE != true ]]; then
    echo ""
    print_message $PURPLE "即将处理 ${#FILES_WITH_EMOJIS[@]} 个文件"
    print_message $PURPLE "每个文件都会自动创建备份"
    read -p "是否继续? (y/N): " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        print_message $YELLOW "操作已取消"
        exit 0
    fi
fi

# 处理文件
print_message $BLUE "开始处理文件..."
PROCESSED_COUNT=0
ERROR_COUNT=0
BACKUP_COUNT=0

for file in "${FILES_WITH_EMOJIS[@]}"; do
    print_message $BLUE "正在处理: $file"
    
    # 创建备份
    backup_file="$file.emoji-backup.$(date +%Y%m%d_%H%M%S)"
    if cp "$file" "$backup_file" 2>/dev/null; then
        ((BACKUP_COUNT++))
        if [[ $VERBOSE == true ]]; then
            print_message $GREEN "已创建备份: $backup_file"
        fi
    else
        print_message $RED "无法创建备份: $file"
        ((ERROR_COUNT++))
        continue
    fi
    
    # 使用Python处理文件
    temp_file="$file.tmp.$$"
    result=$(process_file_with_python "$file" "$temp_file")
    
    if [[ "$result" == "SUCCESS" && -f "$temp_file" ]]; then
        if mv "$temp_file" "$file" 2>/dev/null; then
            ((PROCESSED_COUNT++))
            if [[ $VERBOSE == true ]]; then
                print_message $GREEN "✓ 已处理: $file"
            fi
        else
            print_message $RED "✗ 无法保存文件: $file"
            # 恢复备份
            mv "$backup_file" "$file" 2>/dev/null
            rm -f "$temp_file"
            ((ERROR_COUNT++))
        fi
    else
        print_message $RED "✗ 处理失败: $file"
        # 恢复备份
        mv "$backup_file" "$file" 2>/dev/null
        rm -f "$temp_file"
        ((ERROR_COUNT++))
    fi
done

# 显示结果
echo ""
print_message $GREEN "处理完成!"
print_message $GREEN "成功处理: $PROCESSED_COUNT 个文件"
print_message $GREEN "创建备份: $BACKUP_COUNT 个文件"
if [[ $ERROR_COUNT -gt 0 ]]; then
    print_message $RED "处理失败: $ERROR_COUNT 个文件"
fi

print_message $BLUE "备份文件命名格式: filename.emoji-backup.YYYYMMDD_HHMMSS"
print_message $BLUE "如需恢复，可以使用: mv filename.emoji-backup.* filename"

# 验证结果
print_message $YELLOW "正在验证清理结果..."
remaining_files=()
while IFS= read -r -d '' file; do
    if is_safe_to_modify "$file" && grep -q "$SIMPLE_EMOJI_PATTERN" "$file" 2>/dev/null; then
        remaining_files+=("$file")
    fi
done < <(find . -type f \
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
    -not -name "*emoji-backup*" \
    -print0)

if [[ ${#remaining_files[@]} -eq 0 ]]; then
    print_message $GREEN "✓ 验证通过: 所有源代码文件的emoji已清理完毕"
else
    print_message $YELLOW "注意: 仍有 ${#remaining_files[@]} 个文件包含emoji:"
    for file in "${remaining_files[@]}"; do
        echo "  - $file"
    done
fi

print_message $YELLOW "建议运行项目测试确保功能正常"
print_message $BLUE "如果一切正常，可以删除备份文件: find . -name '*.emoji-backup.*' -delete"
