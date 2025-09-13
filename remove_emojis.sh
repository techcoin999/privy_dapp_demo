#!/bin/bash

# 去除项目文件中所有emoji符号的脚本
# Remove all emoji symbols from project files

set -e  # 遇到错误时退出

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 打印带颜色的消息
print_message() {
    local color=$1
    local message=$2
    echo -e "${color}${message}${NC}"
}

# 显示帮助信息
show_help() {
    echo "用法: $0 [选项]"
    echo ""
    echo "选项:"
    echo "  -h, --help     显示此帮助信息"
    echo "  -d, --dry-run  预览模式，只显示会被修改的文件，不实际修改"
    echo "  -b, --backup   在修改前创建备份文件"
    echo "  -v, --verbose  详细输出模式"
    echo ""
    echo "此脚本会去除项目中以下类型文件的emoji符号:"
    echo "  - Markdown文件 (*.md)"
    echo "  - 文本文件 (*.txt)"
    echo "  - JavaScript/TypeScript文件 (*.js, *.jsx, *.ts, *.tsx)"
    echo "  - JSON文件 (*.json)"
    echo "  - HTML文件 (*.html)"
    echo "  - CSS文件 (*.css)"
    echo ""
    echo "排除目录: node_modules, dist, .git"
}

# 默认参数
DRY_RUN=false
CREATE_BACKUP=false
VERBOSE=false

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
        -b|--backup)
            CREATE_BACKUP=true
            shift
            ;;
        -v|--verbose)
            VERBOSE=true
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

print_message $BLUE "开始扫描项目文件中的emoji符号..."

# 定义要处理的文件类型
FILE_EXTENSIONS=("*.md" "*.txt" "*.js" "*.jsx" "*.ts" "*.tsx" "*.json" "*.html" "*.css")

# 定义要排除的目录
EXCLUDE_DIRS=("node_modules" "dist" ".git" ".next" "build" "coverage")

# 查找包含emoji的文件
print_message $YELLOW "正在搜索包含emoji的文件..."

# 创建临时文件来存储找到的文件列表
TEMP_FILE=$(mktemp)
FILES_WITH_EMOJIS=()

# 使用简单的方法查找包含常见emoji的文件
find . -type f \( -name "*.md" -o -name "*.txt" -o -name "*.js" -o -name "*.jsx" -o -name "*.ts" -o -name "*.tsx" -o -name "*.json" -o -name "*.html" -o -name "*.css" \) \
    -not -path "./node_modules/*" \
    -not -path "./dist/*" \
    -not -path "./.git/*" \
    -not -path "./.next/*" \
    -not -path "./build/*" \
    -not -path "./coverage/*" \
    -exec grep -l $'[\U1F600-\U1F64F\U1F300-\U1F5FF\U1F680-\U1F6FF\U1F1E0-\U1F1FF\U2600-\U26FF\U2700-\U27BF\U1F900-\U1F9FF\U1F018-\U1F270\U238C-\U2454\U20D0-\U20FF\UFE0F\U200D\U2049\U203C\U2139\U2194-\U2199\U21A9-\U21AA\U231A-\U231B\U2328\U23CF\U23E9-\U23F3\U23F8-\U23FA\U24C2\U25AA-\U25AB\U25B6\U25C0\U25FB-\U25FE\U2B05-\U2B07\U2B1B-\U2B1C\U2B50\U2B55\U3030\U303D\U3297\U3299]' {} \; > "$TEMP_FILE" 2>/dev/null || true

# 读取找到的文件
if [[ -f "$TEMP_FILE" && -s "$TEMP_FILE" ]]; then
    while IFS= read -r file; do
        FILES_WITH_EMOJIS+=("$file")
    done < "$TEMP_FILE"
fi
rm -f "$TEMP_FILE"

# 检查是否找到包含emoji的文件
if [[ ${#FILES_WITH_EMOJIS[@]} -eq 0 ]]; then
    print_message $GREEN "✓ 没有找到包含emoji的文件"
    exit 0
fi

print_message $YELLOW "找到 ${#FILES_WITH_EMOJIS[@]} 个包含emoji的文件:"
for file in "${FILES_WITH_EMOJIS[@]}"; do
    echo "  - $file"
done

if [[ $DRY_RUN == true ]]; then
    print_message $BLUE "预览模式: 以下文件将被修改 (实际未修改)"
    for file in "${FILES_WITH_EMOJIS[@]}"; do
        print_message $YELLOW "预览: $file"
        # 显示会被删除的emoji
        grep -o $'[\U1F600-\U1F64F\U1F300-\U1F5FF\U1F680-\U1F6FF\U1F1E0-\U1F1FF\U2600-\U26FF\U2700-\U27BF\U1F900-\U1F9FF\U1F018-\U1F270\U238C-\U2454\U20D0-\U20FF\UFE0F\U200D\U2049\U203C\U2139\U2194-\U2199\U21A9-\U21AA\U231A-\U231B\U2328\U23CF\U23E9-\U23F3\U23F8-\U23FA\U24C2\U25AA-\U25AB\U25B6\U25C0\U25FB-\U25FE\U2B05-\U2B07\U2B1B-\U2B1C\U2B50\U2B55\U3030\U303D\U3297\U3299]' "$file" 2>/dev/null | sort | uniq | while read -r emoji; do
            echo "    将删除: $emoji"
        done
    done
    exit 0
fi

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
    if [[ $CREATE_BACKUP == true ]]; then
        cp "$file" "$file.backup"
        if [[ $VERBOSE == true ]]; then
            print_message $GREEN "已创建备份: $file.backup"
        fi
    fi
    
    # 去除emoji - 使用Python脚本进行更准确的Unicode处理
    if python3 -c "
import re
import sys

# 读取文件内容
with open('$file', 'r', encoding='utf-8') as f:
    content = f.read()

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

# 写入临时文件
with open('$file.tmp', 'w', encoding='utf-8') as f:
    f.write(cleaned_content)
" 2>/dev/null; then
        mv "$file.tmp" "$file"
        ((PROCESSED_COUNT++))
        if [[ $VERBOSE == true ]]; then
            print_message $GREEN "✓ 已处理: $file"
        fi
    else
        print_message $RED "✗ 处理失败: $file"
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

if [[ $CREATE_BACKUP == true ]]; then
    print_message $BLUE "备份文件已创建，文件名后缀为 .backup"
    print_message $BLUE "如需恢复，可以使用: mv filename.backup filename"
fi

print_message $YELLOW "建议运行测试确保项目仍然正常工作"
